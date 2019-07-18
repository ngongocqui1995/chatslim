import { url } from "../Variable/general"
import axios from 'axios'

export default class {
  
    static async _phan_Hoi(message) {
      const res = await axios.post(`${url}chatbox`, {
        message: message
      })
      const data = res.data 

      return data
    }
}