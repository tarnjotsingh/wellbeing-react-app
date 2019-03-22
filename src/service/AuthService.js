import decode from "jwt-decode";

/**
 * Service class that provides methods for requesting a Json Web Token
 * for authorizing the use of endpoints that allowed per user roles.
 */
class AuthService {


    /**
     * Method requests for a new token based on the username and password.
     * Will save the token(s) to localStorage and return an access token.
     * @param username
     * @param password
     * @returns {string}
     */
    static async getToken(username, password) {
        let path = `/oauth/token?grant_type=password&username=${username}&password=${password}`;
        let request = {
            Authorization: `Basic ${localStorage.getItem("clientAuth")}`,
            method: "POST",
        };
        // Send the POST request to get authenticated and get a token to use against requests.
        const response = await fetch(path, request)
            .then(response => {
                //console.log("Auth service...");
                return response.json();
            })
            .catch(error => {
                console.error("Error while fetching token...");
                console.error(error);
            });

        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);
        localStorage.setItem("bearer", "Bearer " + response.access_token);
        //console.log(localStorage.getItem("tokens"));
        //return isValid ? response.access_token : "Bad token";
        return response.access_token;
    }

    /**
     * Method to validate the access-token that is currently stored in
     * localStorage.
     * This method will use the /check_token endpoint that is part of the oauth2
     * standard that implemented into SpringBoot.
     * @return {boolean} Boolean value determining if the access-token is
     * valid or not.
     */
    static async validateToken(token) {
        let path = `/oauth/check_token?token=${token}`;
        let request = {
            Authorization: `Basic ${localStorage.getItem("clientAuth")}`,
            method: "GET",
        };

        const response = await fetch(path, request)
            .then(response => {
                //console.log("Validating token...");
                return response;
            })
            .catch(error => {
                console.log("Error while validating token...");
                console.log(error);
            });

        //console.log(response);
        return (response.status === 200);
    }

    /**
     * Basic method for checking if a token/refreshToken is present in the
     * localStore and check if it has expired or not.
     * I should probably change this to use the /check_token endpoint to verify that the
     * token is still valid rather than doing this little thing.
     * @returns {boolean} Signifying if a non-expired token is present in localStore
     * or not.
     */
    static checkTokenExpired() {
        console.log("Checking if token expired...");
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if(!token || !refreshToken) {
            console.error("Access token or refresh token...");
            return false;
        }
        try {
            const {exp} = decode(refreshToken);
            // Check if the token has expired or not. Return false if it has.
            if(exp < (new Date().getTime() / 1000)){
                console.error("Expired token...");
                return false;
            }
        }
        catch(e) {
            console.error(e);
            return false;
        }
        return true;
    }

    /**
     * Simple method to just remove the stored tokens from the localStore.
     * No token => no access to application.
     */
    static revokeAuth() {
        localStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");
        localStorage.setItem("bearer", "");
    }
}

export default AuthService;