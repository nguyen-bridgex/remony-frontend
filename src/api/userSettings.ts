export const API_URL = "https://huuz9eft1e.execute-api.ap-northeast-1.amazonaws.com/prod/setting";

// API function for user settings
export interface UpdateSettingsRequest {
  heart_rate_threshold: number;
  skin_temp_threshold: number;
  heart_rate_alert_enable: boolean;
  skin_temp_alert_enable: boolean;
}

export interface UpdateSettingsResponse {
  success: boolean;
  message: string;
  data?: UpdateSettingsRequest;
}

export const updateUserSettings = async (
  userId: number,
  settings: UpdateSettingsRequest
): Promise<UpdateSettingsResponse> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/lambda/setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...settings
    }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while updating settings',
    };
  }
}; 