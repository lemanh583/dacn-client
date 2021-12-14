import axios from "axios";
// import { mapMutations } from "vuex";

export const handleNotification = (array, key) => {
  for (let value of array) {
    if (value.param == key) {
      return value.msg;
    }
  }
};

export const checkToken = async () => {
  try {
    let token = localStorage.getItem('token')
    if(token) {
      let response =  await axios.get(`${process.env.VUE_APP_URL}/user/get-token`, {
        headers: { 'Authorization': 'Bearer ' + token}
      })
      if(response.data.success) {
        return response.data
      } 
    } else {
      return false
    }
  } catch (error) {
    console.error(error.response)
    if(!error.response.data.success) {
       return false
    }
  }
}



// export default {handleNotification}
