<template>
  <div class="container">
    <div class="form-container">
      <h2>Simulação de Empréstimo</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Valor do Empréstimo</label>
          <input
            v-model="loanValue"
            type="text"
            @input="formatCurrency"
            required
          />
        </div>

        <div class="form-group">
          <label>Instituições</label>
          <select v-model="selectedInstitutions" multiple>
            <option
              v-for="institution in loanStore.getInstitutions()"
              :key="institution.id"
              :value="institution.id"
            >
              {{ institution.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Convênios</label>
          <select v-model="selectedAgreements" multiple>
            <option
              v-for="agreement in loanStore.getAgreements()"
              :key="agreement.id"
              :value="agreement.id"
            >
              {{ agreement.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Quantidade de parcelas</label>
          <select v-model="installmentValue">
            <option
              v-for="installment in availableInstallments"
              :key="installment"
            >
              {{ installment }}
            </option>
          </select>
        </div>

        <button type="submit">Simular</button>
      </form>
    </div>

    <div class="offers-container">
      <h2>Ofertas de Empréstimo</h2>
      <div class="offers-list">
        <div v-for="offer in offers" :key="offer.id" class="offer-card">
          <p><strong>Instituição:</strong> {{ offer.institution }}</p>
          <p><strong>Valor:</strong> {{ offer.amount }}</p>
          <p><strong>Parcelas:</strong> {{ offer.installments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useLoanStore } from "@/store/loanStore";

export default {
  setup() {
    const loanStore = useLoanStore();

    const loanValue = ref("");
    const selectedInstitutions = ref([]);
    const selectedAgreements = ref([]);
    const installmentValue = ref("");
    const availableInstallments = [36, 48, 60, 72, 84];

    const institutions = computed(() => loanStore.institutions);
    const agreements = computed(() => loanStore.agreements);
    const offers = computed(() => loanStore.offers);

    onMounted(() => {
      loanStore.fetchInstitutions();
      loanStore.fetchAgreements();
    });

    const formatCurrency = (event) => {
      let value = event.target.value.replace(/\D/g, "");
      value = (value / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      loanValue.value = value;
    };

    const submitForm = () => {
      loanStore.fetchLoanOffers(
        parseFloat(loanValue.value.replace("R$", "").replace(",", ".")),
        selectedInstitutions.value,
        selectedAgreements.value,
        installmentValue.value
      );
    };

    return {
      loanStore,
      loanValue,
      selectedInstitutions,
      selectedAgreements,
      installmentValue,
      availableInstallments,
      institutions,
      agreements,
      offers,
      formatCurrency,
      submitForm,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.form-container {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.offers-container {
  flex: 2;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 500px;
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.offer-card {
  background-color: #ff6600;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #cc5500;
}
</style>
