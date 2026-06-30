import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';

export const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(
      serverUrl + "/api/user/currentuser",
      { withCredentials: true }
    );
    
    dispatch(setUserData(result.data.user));
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const generateNotes = async(payload) => {
  try{
    const result = await axios.post(serverUrl + "/api/notes/generate-notes", payload, { withCredentials: true });
    console.log("Notes generated successfully:", result.data);
    return result.data;

  }catch(error){
    console.error("Error generating notes:", error);
    throw error;
  }
}

export const downloadPDF = async (result) => {
  try{
    const response = await axios.post(
      serverUrl + "/api/pdf/download",
      { result },
      {
        responseType: 'blob',
        withCredentials: true,
      }
    );
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Note_Mind_IO.pdf';
    link.click();
    window.URL.revokeObjectURL(url);

  }catch(error){
    console.error("Error downloading PDF:", error);
  }
}