import { Sneaker } from "./types";

export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
}

// Check connection / fetch existing backups
export async function listBackups(accessToken: string): Promise<DriveBackupFile[]> {
  const query = encodeURIComponent("name contains 'jordan_sneakers_backup' and mimeType = 'application/json' and trashed = false");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime)&orderBy=createdTime desc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list backups from Google Drive: ${response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

// Download content of a specific file
export async function downloadBackup(accessToken: string, fileId: string): Promise<Sneaker[]> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download backup: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid backup format in Drive file");
  }
  return data;
}

// Upload/Create new backup file
export async function uploadBackup(accessToken: string, sneakers: Sneaker[], customizedName?: string): Promise<DriveBackupFile> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = customizedName
    ? `jordan_sneakers_backup_${customizedName.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`
    : `jordan_sneakers_backup_${timestamp}.json`;

  // 1. Create file metadata
  const metadataResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: filename,
      mimeType: "application/json",
    }),
  });

  if (!metadataResponse.ok) {
    throw new Error(`Failed to create backup file metadata: ${metadataResponse.statusText}`);
  }

  const fileInfo = await metadataResponse.json();
  const fileId = fileInfo.id;

  // 2. Upload actual content
  const contentResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sneakers),
  });

  if (!contentResponse.ok) {
    throw new Error(`Failed to write backup content to Google Drive: ${contentResponse.statusText}`);
  }

  return {
    id: fileId,
    name: filename,
    createdTime: new Date().toISOString(),
  };
}

// Delete a backup file from Google Drive (Mandatory user confirmation applies in UI level)
export async function deleteBackup(accessToken: string, fileId: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete backup: ${response.statusText}`);
  }
}
