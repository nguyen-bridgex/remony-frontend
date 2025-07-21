export interface UpdateSettingsRequest {
  // Steps
  step_min: number;
  step_max: number;
  step_alert_enable: boolean;
  
  // Distance
  distance_min: number;
  distance_max: number;
  distance_alert_enable: boolean;
  
  // Heart Rate
  heart_rate_min: number;
  heart_rate_max: number;
  heart_rate_alert_enable: boolean;
  
  // Sleep
  sleep_min: number;
  sleep_max: number;
  sleep_alert_enable: boolean;
  
  // BMR Calories
  bmr_cals_min: number;
  bmr_cals_max: number;
  bmr_cals_alert_enable: boolean;
  
  // Activity Calories
  act_cals_min: number;
  act_cals_max: number;
  act_cals_alert_enable: boolean;
  
  // Skin Temperature
  skin_temp_min: number;
  skin_temp_max: number;
  skin_temp_alert_enable: boolean;
  
  // Solar Generation
  solar_gen_min: number;
  solar_gen_max: number;
  solar_gen_alert_enable: boolean;
  
  // Thermal Generation
  thermal_gen_min: number;
  thermal_gen_max: number;
  thermal_gen_alert_enable: boolean;
  
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
        // Steps
        step_min: result.settings.step_min || 0,
        step_max: result.settings.step_max || 10000,
        step_alert_enable: result.settings.step_alert_enable || false,
        
        // Distance
        distance_min: result.settings.distance_min || 0,
        distance_max: result.settings.distance_max || 10,
        distance_alert_enable: result.settings.distance_alert_enable || false,
        
        // Heart Rate
        heart_rate_min: result.settings.heart_rate_min || 50,
        heart_rate_max: result.settings.heart_rate_max || 150,
        heart_rate_alert_enable: result.settings.heart_rate_alert_enable || true,
        
        // Sleep
        sleep_min: result.settings.sleep_min || 6,
        sleep_max: result.settings.sleep_max || 10,
        sleep_alert_enable: result.settings.sleep_alert_enable || false,
        
        // BMR Calories
        bmr_cals_min: result.settings.bmr_cals_min || 1200,
        bmr_cals_max: result.settings.bmr_cals_max || 2500,
        bmr_cals_alert_enable: result.settings.bmr_cals_alert_enable || false,
        
        // Activity Calories
        act_cals_min: result.settings.act_cals_min || 200,
        act_cals_max: result.settings.act_cals_max || 1000,
        act_cals_alert_enable: result.settings.act_cals_alert_enable || false,
        
        // Skin Temperature
        skin_temp_min: result.settings.skin_temp_min || 35.0,
        skin_temp_max: result.settings.skin_temp_max || 38.5,
        skin_temp_alert_enable: result.settings.skin_temp_alert_enable || true,
        
        // Solar Generation
        solar_gen_min: result.settings.solar_gen_min || 0,
        solar_gen_max: result.settings.solar_gen_max || 100,
        solar_gen_alert_enable: result.settings.solar_gen_alert_enable || false,
        
        // Thermal Generation
        thermal_gen_min: result.settings.thermal_gen_min || 0,
        thermal_gen_max: result.settings.thermal_gen_max || 100,
        thermal_gen_alert_enable: result.settings.thermal_gen_alert_enable || false,
        
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
        step_min: 0,
        step_max: 10000,
        step_alert_enable: false,
        distance_min: 0,
        distance_max: 10,
        distance_alert_enable: false,
        heart_rate_min: 50,
        heart_rate_max: 150,
        heart_rate_alert_enable: true,
        sleep_min: 6,
        sleep_max: 10,
        sleep_alert_enable: false,
        bmr_cals_min: 1200,
        bmr_cals_max: 2500,
        bmr_cals_alert_enable: false,
        act_cals_min: 200,
        act_cals_max: 1000,
        act_cals_alert_enable: false,
        skin_temp_min: 35.0,
        skin_temp_max: 38.5,
        skin_temp_alert_enable: true,
        solar_gen_min: 0,
        solar_gen_max: 100,
        solar_gen_alert_enable: false,
        thermal_gen_min: 0,
        thermal_gen_max: 100,
        thermal_gen_alert_enable: false,
        alert_message: '',
      },
    };
  }
}; 