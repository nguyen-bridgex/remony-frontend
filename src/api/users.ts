import { User } from "../types/user";

export interface GetUsersResponse {
    success: boolean;
    message: string;
    data?: User[];
}

export interface GetUserResponse {
    success: boolean;
    message: string;
    data?: User;
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