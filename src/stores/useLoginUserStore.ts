import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserUsingGet } from '@/api/userController'

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVo>({
    userName: "未登录",
  });

  async function fetchLoginUser() {
    // 从后端的session中取出当前登录的用户
    const res = await getLoginUserUsingGet();
    if(res.data.code === 0 && res.data.data){
      loginUser.value = res.data.data;
    }
  }


  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});
