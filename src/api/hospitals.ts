// Hospital API interface definitions
export interface Hospital {
  id: number;
  name: string;
  address: string | null;
  service_account: string | null;
  client_id: string | null;
  client_secret: string | null;
  bot_no: string | null;
  token_url: string | null;
  api_base_url: string | null;
  private_key: string | null;
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

// New interfaces for hospital CRUD
export interface CreateHospitalRequest {
  name: string;
  address?: string;
  service_account?: string;
  client_id?: string;
  client_secret?: string;
  bot_no?: string;
  token_url?: string;
  api_base_url?: string;
  private_key?: string;
}

export interface EditHospitalRequest {
  id: number;
  name: string;
  address?: string;
  service_account?: string;
  client_id?: string;
  client_secret?: string;
  bot_no?: string;
  token_url?: string;
  api_base_url?: string;
  private_key?: string;
}

export interface DeleteHospitalRequest {
  id: number;
}

export interface CreateHospitalResponse {
  success: boolean;
  hospital?: Hospital;
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
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching hospital list:', error);
    return {
      success: false,
      message: 'Failed to fetch hospital list'
    };
  }
};

export const addUserToHospital = async (data: AddUserToHospitalRequest): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/addUserToHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding user to hospital:', error);
    return {
      success: false,
      message: 'Failed to add user to hospital'
    };
  }
};

export const removeUserFromHospital = async (data: RemoveUserFromHospitalRequest): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/removeUserFromHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing user from hospital:', error);
    return {
      success: false,
      message: 'Failed to remove user from hospital'
    };
  }
};

// New CRUD operations for hospitals
export const createHospital = async (data: CreateHospitalRequest): Promise<CreateHospitalResponse> => {
  try {
    const response = await fetch('/api/addHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating hospital:', error);
    return {
      success: false,
      message: 'Failed to create hospital'
    };
  }
};

export const editHospital = async (data: EditHospitalRequest): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/editHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error editing hospital:', error);
    return {
      success: false,
      message: 'Failed to edit hospital'
    };
  }
};

export const deleteHospital = async (data: DeleteHospitalRequest): Promise<HospitalOperationResponse> => {
  try {
    const response = await fetch('/api/removeHospital', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return {
      success: false,
      message: 'Failed to delete hospital'
    };
  }
}; 