
  <template>

    <div class="d-flex justify-content-center align-items-center min-vh-100">
    <!--begin::Wrapper-->
      <div class="w-lg-300px p-10 mx-auto">
        <!--begin::Heading-->
        <div class="text-center mb-10">
          <h1 class="text-dark mb-3">Login</h1>
        </div>
        <!--end::Heading-->
    
        <!--begin::Form-->
        <form @submit.prevent="login" class="form w-100">
          <!--begin::Input group-->
          <div class="fv-row mb-10">
            <label for="email" class="form-label fs-6 fw-bold text-dark">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control form-control-lg form-control-solid"
              placeholder="Enter your email"
              required
            />
          </div>
          <!--end::Input group-->
    
          <!--begin::Input group-->
          <div class="fv-row mb-10">
            <label for="password" class="form-label fs-6 fw-bold text-dark">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control form-control-lg form-control-solid"
              placeholder="Enter your password"
              required
            />
          </div>
          <!--end::Input group-->
    
          <!--begin::Actions-->
          <div class="text-center">
            <button
              tabindex="3"
              type="submit"
              id="kt_sign_in_submit"
              ref="submitButton"
              class="btn btn-lg btn-primary w-100 mb-5"
            >
              <span class="indicator-label">Login</span>
              <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
            </button>
          </div>
          <!--end::Actions-->
  
        </form>
        <!--end::Form-->
      </div>
      <!--end::Wrapper-->      
    </div>

  </template>
  
  <script lang="ts">
  import axios from "axios";
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";
  import { defineComponent, ref } from "vue";
  
  axios.defaults.withCredentials = true;
  
  export default defineComponent({
    setup() {
      const email = ref("");
      const password = ref("");
      const router = useRouter();
  
      const login = async () => {
        try {
          const response = await axios.post("http://13.251.160.30:4000/auth/login", {
            email: email.value,
            password: password.value,
          });
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userEmail", response.data.user);
          localStorage.setItem("userName", response.data.firstName);
  
          Swal.fire({
            text: "You have successfully logged in!",
            icon: "success",
            confirmButtonText: "OK, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            router.push("/dashboard");
          });
        } catch (error: any) {
          console.error(error);
          Swal.fire({
            text: "Invalid email or password",
            icon: "error",
            confirmButtonText: "Try again",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        }
      };
  
      return {
        email,
        password,
        login,
      };
    },
  });
  </script>
  
  
  <style scoped>

  </style>
  
