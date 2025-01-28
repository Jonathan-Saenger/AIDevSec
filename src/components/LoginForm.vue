<template>
    <div class="login-form" :class="{'visible': isVisible}" @click.self="toggleVisibility">
        <div class="login-container">
            <div class="close-button" @click="toggleVisibility">&times;</div>
            <h2>Administration</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <input 
                        type="email"
                        v-model="email"
                        placeholder="Email"
                        required
                    >
                </div>
                <div class="form-group">
                    <input 
                        type="password"
                        v-model="password"
                        placeholder="Mot de passe"
                        required
                    >
                </div>
                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
                </button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const isVisible = ref(false); 

const handleLogin = async () => {
    try {
        isLoading.value = true;
        error.value = '';

        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: email.value, 
            password: password.value
        });

        //Token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Fermer le formulaire
        isVisible.value = false;

        //Redirection dashboard
        router.push('/admin');
    } catch (err) {
        error.value = err.response?.data?.message || 'Erreur de connexion';
    } finally {
        isLoading.value = false;
    }
};

//Afficher / masquer le formulaire 
const toggleVisibility = () => {
    isVisible.value = !isVisible.value;
}

defineExpose({ toggleVisibility });

</script>

<style scoped>
.login-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.login-form.visible {
  opacity: 1;
  visibility: visible;
}

.login-container {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

h2 {
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4a9eff;
}

button {
  width: 100%;
  padding: 0.8rem;
  background: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #357abd;
}

button:disabled {
  background: #666;
  cursor: not-allowed;
}

.error {
  color: #ff4a4a;
  margin-top: 1rem;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #fff;
}
</style>