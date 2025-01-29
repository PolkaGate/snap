export async function getLatestPackageVersion(packageName: string): Promise<string> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch package information. Status: ${response.status}`);
    }

    const responseData = await response.json();
    const latestVersion = responseData['dist-tags'].latest;
    return latestVersion;
  } catch (error:any) {
    throw error;
  }
}
