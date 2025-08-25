// Hospital API interface definitions
export interface Hospital {
  id: number;
  name: string;
  address: string | null;
}

export interface GetHospitalListResponse {
  success: boolean;
  hospitals?: Hospital[];
  message?: string;
}

export interface AddUserToHospitalRequest {
  hospital_id: number;
  user_id: string;
}

export interface RemoveUserFromHospitalRequest {
  hospital_id: number;
  user_id: string;
}

export interface HospitalOperationResponse {
  success: boolean;
  message?: string;
}

// API Functions
export const getHospitalList = async (): Promise<GetHospitalListResponse> => {
  try {
    const response = await fetch('/api/getHospitalList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.hospitals && Array.isArray(result.hospitals)) {
      return {
        success: true,
        hospitals: result.hospitals,
      };
    } else {
      throw new Error('Invalid response structure: hospitals array not found');
    }
  } catch (error) {
    console.error('Error getting hospital list:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while getting hospital list',
    };
  }
};

export const addUserToHospital = async (
  request: AddUserToHospitalRequest
): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/addUserToHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        message: 'User successfully added to hospital',
      };
    } else {
      throw new Error(result.message || 'Failed to add user to hospital');
    }
  } catch (error) {
    console.error('Error adding user to hospital:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while adding user to hospital',
    };
  }
};

export const removeUserFromHospital = async (
  request: RemoveUserFromHospitalRequest
): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/removeUserFromHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        message: 'User successfully removed from hospital',
      };
    } else {
      throw new Error(result.message || 'Failed to remove user from hospital');
    }
  } catch (error) {
    console.error('Error removing user from hospital:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while removing user from hospital',
    };
  }
}; 