import { User, UserFormData } from "../types/user";

export interface PaginationInfo {
    total_count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    offset: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface GetUsersResponse {
    success: boolean;
    message?: string;
    users?: User[];
    pagination?: PaginationInfo;
    filters?: {
        search?: string;
        alert_enabled?: number;
        has_settings?: boolean;
        order_by?: string;
        order_direction?: string;
    };
}

export interface GetUserResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
}

export interface GetUsersParams {
    limit?: number;
    offset?: number;
    search?: string;
    order_by?: string;
    order_direction?: 'ASC' | 'DESC';
    hospital_id?: number;
}

export const getUsers = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
    try {
        const requestBody = {
            limit: params.limit || 50,
            offset: params.offset || 0,
            ...params
        };

        const response = await fetch('/api/getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle the new response structure
        if (result.success && result.users && Array.isArray(result.users)) {
            return {
                success: true,
                users: result.users,
                pagination: result.pagination,
                filters: result.filters
            };
        } else {
            throw new Error('Invalid response structure: users array not found');
        }
    } catch (error) {
        console.error('Error getting users:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while getting users',
        };
    }
};

export const getUser = async (userId: number): Promise<GetUserResponse> => {
    try {
        const response = await fetch('/api/getUserinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId.toString().padStart(6, '0') }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.user) {
            return {
                success: true,
                message: 'User fetched successfully',
                data: result.user
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error getting user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while getting user',
        };
    }
};

export const registUser = async (user: User): Promise<GetUserResponse> => {
    try {
        const response = await fetch('/api/registUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.user_id) {
            return {
                success: true,
                message: 'User registed successfully',
                data: result.user
            };
        } else {    
            throw new Error('User not registed');
        }
    } catch (error) {
        console.error('Error registing user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while registing user',
        };
    }
};

export const deleteUser = async (userId: number): Promise<DeleteUserResponse> => {
    try {
        const response = await fetch('/api/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId.toString().padStart(6, '0') }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Check if the response indicates successful deletion
        if (result.message && result.message.includes('marked as deleted') && result.user_id) {
            return {
                success: true,
                message: result.message,
            };
        } else {
            throw new Error(result.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while deleting user',
        };
    }
};

export const updateUser = async (userId: number, userData: UserFormData): Promise<GetUserResponse> => {
    try {
        const response = await fetch('/api/updateUserinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId.toString().padStart(6, '0'),
                ...userData
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                message: 'User updated successfully',
                data: result.user
            };
        } else {
            throw new Error(result.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while updating user',
        };
    }
};