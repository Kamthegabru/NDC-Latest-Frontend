// utils/handleApiError.js
import { toast } from "react-toastify";

const handleApiError = (error, defaultMessage = "Something went wrong") => {
    if (error.message === "Network Error") {
        toast.error("Network Error: Please check your connection.");
    } else if (error.response && error.response.data) {
        const { message, errors } = error.response.data;

        // If multiple errors (like from express-validator)
        if (Array.isArray(errors)) {
            errors.forEach((err) => toast.error(err.msg || err.message || defaultMessage));
        } else {
            toast.error(message || defaultMessage);
        }
    } else {
        toast.error(defaultMessage);
    }
};

export default handleApiError;
