import {useMutation, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

import URL from '../components/url/BackendUrl'

const useFollow = ()=>{
    const queryClient = useQueryClient()

    const {mutate : follow, isPending} = useMutation({
        mutationFn : async(userId)=>{
            try {
                const response = await fetch(`${URL}/api/users/follow/${userId}`,{
                    method : "POST",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })  
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong")
                }
                return data

            } catch (error) {
                
            }
        },
        onSuccess : ()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey : ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey : ["authUser"]}),
            ])
        },
        onError : (error)=>{
            toast.error(error.message)
        }
    })
    return {follow , isPending}
}
export default useFollow