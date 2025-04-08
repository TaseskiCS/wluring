import { NextResponse } from 'next/server';
import { RingItem } from '../../types/RingItem';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('GitHub token is missing!');
}

console.log('GitHub Token:', GITHUB_TOKEN);  

const REPO_OWNER = 'taseskics';
const REPO_NAME = 'wluring';



export async function POST(req: Request) {
  try {
    const { username, displayName, url, grad_date } = await req.json();

    if (!displayName || !url || !grad_date) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Get the default branch of the repo FIRST
    const defaultBranchResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const defaultBranchData = await defaultBranchResponse.json();
    const defaultBranch = defaultBranchData.default_branch;

    // Init new branch so it doesn't mess with the main branch
    const newBranchName = `add-ring-item-${Date.now()}`;
    const getBranchResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${defaultBranch}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const getBranchData = await getBranchResponse.json();

    // Debug log to inspect the response structure
    console.log('getBranchData:', getBranchData);

    // Check if the response contains the expected structure
    if (!getBranchData.object || !getBranchData.object.sha) {
      return NextResponse.json({ message: 'Failed to retrieve branch information.' }, { status: 500 });
    }

    const sha = getBranchData.object.sha;

    // Create the new branch
    await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: sha,
      }),
    });

    // Add item to existing RingItems
    const filePath = 'public/RingItems.json';
    const fetchFileResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${defaultBranch}`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const fileContent = await fetchFileResponse.json();
    const ringItems = JSON.parse(Buffer.from(fileContent.content, 'base64').toString());

    // Check for duplicates
    const isDuplicate = ringItems.some((item: RingItem) =>
      item?.username?.toLowerCase() === username.toLowerCase() ||
      item?.displayName?.toLowerCase() === displayName.toLowerCase() ||
      item?.url?.replace(/\/+$/, "").toLowerCase() === url.replace(/\/+$/, "").toLowerCase()
    );
    

    if (isDuplicate) {
      return new Response(
        JSON.stringify({ error: 'Duplicate entry: username, display name, or URL already exists.' }),
        { status: 400 }
      );
    }


    // Add the new ring item
    ringItems.push({ username, displayName, url, grad_date });

    // Commit the change to the new branch
    const commitMessage = 'Add new ring item to the web ring';
    const newContent = Buffer.from(JSON.stringify(ringItems, null, 2)).toString('base64');

    await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          message: commitMessage,
          content: newContent,
          sha: fileContent.sha,
          branch: newBranchName,
        }),
      }
    );

    // Create the PR
    const prTitle = 'Add new site to the web ring';
    const prBody = 'A new website has been added to the web ring.';

    await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        title: prTitle,
        head: newBranchName,
        base: defaultBranch,
        body: prBody,
      }),
    });

    return NextResponse.json({ message: 'PR created successfully!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating the PR.' }, { status: 500 });
  }
}
