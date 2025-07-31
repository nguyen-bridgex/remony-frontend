export interface UpdateSettingsRequest {
  // Steps
  step_lower_threshold: number;
  step_upper_threshold: number;
  step_alert_enabled: boolean;
  
  // Distance
  distance_lower_threshold: number;
  distance_upper_threshold: number;
  distance_alert_enabled: boolean;
  
  // Heart Rate
  heart_rate_lower_threshold: number;
  heart_rate_upper_threshold: number;
  heart_rate_alert_enabled: boolean;
  
  // Sleep
  sleep_lower_threshold: number;
  sleep_upper_threshold: number;
  sleep_alert_enabled: boolean;
  
  // BMR Calories
  bmr_cals_lower_threshold: number;
  bmr_cals_upper_threshold: number;
  bmr_cals_alert_enabled: boolean;
  
  // Activity Calories
  act_cals_lower_threshold: number;
  act_cals_upper_threshold: number;
  act_cals_alert_enabled: boolean;
  
  // Skin Temperature
  skin_temp_lower_threshold: number;
  skin_temp_upper_threshold: number;
  skin_temp_alert_enabled: boolean;
  
  // Solar Generation
  solar_gen_lower_threshold: number;
  solar_gen_upper_threshold: number;
  solar_gen_alert_enabled: boolean;
  
  // Thermal Generation
  thermal_gen_lower_threshold: number;
  thermal_gen_upper_threshold: number;
  thermal_gen_alert_enabled: boolean;
  
  // Alert message
  alert_message: string;
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
        userId: userId.toString().padStart(6, '0'), // Convert to string format like "000001"
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
        userId: userId.toString().padStart(6, '0'),
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
        // Steps
        step_lower_threshold: result.settings.step_lower_threshold || 0,
        step_upper_threshold: result.settings.step_upper_threshold || 10000,
        step_alert_enabled: result.settings.step_alert_enabled || false,
        
        // Distance
        distance_lower_threshold: result.settings.distance_lower_threshold || 0,
        distance_upper_threshold: result.settings.distance_upper_threshold || 10,
        distance_alert_enabled: result.settings.distance_alert_enabled || false,
        
        // Heart Rate
        heart_rate_lower_threshold: result.settings.heart_rate_lower_threshold || 50,
        heart_rate_upper_threshold: result.settings.heart_rate_upper_threshold || 150,
        heart_rate_alert_enabled: result.settings.heart_rate_alert_enabled || true,
        
        // Sleep
        sleep_lower_threshold: result.settings.sleep_lower_threshold || 6,
        sleep_upper_threshold: result.settings.sleep_upper_threshold || 10,
        sleep_alert_enabled: result.settings.sleep_alert_enabled || false,
        
        // BMR Calories
        bmr_cals_lower_threshold: result.settings.bmr_cals_lower_threshold || 1200,
        bmr_cals_upper_threshold: result.settings.bmr_cals_upper_threshold || 2500,
        bmr_cals_alert_enabled: result.settings.bmr_cals_alert_enabled || false,
        
        // Activity Calories
        act_cals_lower_threshold: result.settings.act_cals_lower_threshold || 200,
        act_cals_upper_threshold: result.settings.act_cals_upper_threshold || 1000,
        act_cals_alert_enabled: result.settings.act_cals_alert_enabled || false,
        
        // Skin Temperature
        skin_temp_lower_threshold: result.settings.skin_temp_lower_threshold || 35.0,
        skin_temp_upper_threshold: result.settings.skin_temp_upper_threshold || 38.5,
        skin_temp_alert_enabled: result.settings.skin_temp_alert_enabled || true,
        
        // Solar Generation
        solar_gen_lower_threshold: result.settings.solar_gen_lower_threshold || 0,
        solar_gen_upper_threshold: result.settings.solar_gen_upper_threshold || 100,
        solar_gen_alert_enabled: result.settings.solar_gen_alert_enabled || false,
        
        // Thermal Generation
        thermal_gen_lower_threshold: result.settings.thermal_gen_lower_threshold || 0,
        thermal_gen_upper_threshold: result.settings.thermal_gen_upper_threshold || 100,
        thermal_gen_alert_enabled: result.settings.thermal_gen_alert_enabled || false,
        
        // Alert message
        alert_message: result.settings.alert_message || '',
      },
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while getting settings',
      data: {
        // Default values when error occurs
        step_lower_threshold: 0,
        step_upper_threshold: 10000,
        step_alert_enabled: false,
        distance_lower_threshold: 0,
        distance_upper_threshold: 10,
        distance_alert_enabled: false,
        heart_rate_lower_threshold: 50,
        heart_rate_upper_threshold: 150,
        heart_rate_alert_enabled: true,
        sleep_lower_threshold: 6,
        sleep_upper_threshold: 10,
        sleep_alert_enabled: false,
        bmr_cals_lower_threshold: 1200,
        bmr_cals_upper_threshold: 2500,
        bmr_cals_alert_enabled: false,
        act_cals_lower_threshold: 200,
        act_cals_upper_threshold: 1000,
        act_cals_alert_enabled: false,
        skin_temp_lower_threshold: 35.0,
        skin_temp_upper_threshold: 38.5,
        skin_temp_alert_enabled: true,
        solar_gen_lower_threshold: 0,
        solar_gen_upper_threshold: 100,
        solar_gen_alert_enabled: false,
        thermal_gen_lower_threshold: 0,
        thermal_gen_upper_threshold: 100,
        thermal_gen_alert_enabled: false,
        alert_message: '',
      },
    };
  }
}; 