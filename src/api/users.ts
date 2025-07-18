import { User } from "../types/user";

export interface GetUsersResponse {
    success: boolean;
    message: string;
    data?: User[];
}

export const getUsers = async (): Promise<GetUsersResponse> => {
    try {
        const response = await fetch('/api/getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle the response structure where users are in a 'users' array
        if (result.users && Array.isArray(result.users)) {
            return {
                success: true,
                message: 'Users fetched successfully',
                data: result.users
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