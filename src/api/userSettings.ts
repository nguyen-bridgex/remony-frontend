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
    const response = await fetch('/api/updateSettings', {
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

export const getUserSettings = async (
  userId: number,
): Promise<UpdateSettingsResponse> => {
  try {
    const response = await fetch('/api/getSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId
    }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Settings fetched successfully',
      data: {
        heart_rate_threshold: result.settings.heart_rate_threshold,
        skin_temp_threshold: result.settings.skin_temp_threshold,
        heart_rate_alert_enable: result.settings.heart_rate_alert_enabled,
        skin_temp_alert_enable: result.settings.skin_temp_alert_enabled,
      },
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while getting settings',
    };
  }
}; 