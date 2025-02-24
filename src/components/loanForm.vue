<template>
  <div class="container">
    <div class="form-container">
      <h2 class="title">Simulação de empréstimo</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Valor do empréstimo</label>
          <input
            v-model="loanValue"
            type="text"
            @input="formatCurrency"
            required
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>

        <div class="form-group">
          <label>Quantidade de parcelas</label>
          <div class="dropdown">
            <input
              type="text"
              readonly
              :value="
                installmentValue === 0
                  ? 'Sem parcelamento'
                  : installmentValue
                  ? installmentValue + ' parcelas'
                  : ''
              "
              @click="toggleInstallmentsDropdown"
            />
            <span class="dropdown-icon" @click="toggleInstallmentsDropdown">
              <svg
                v-if="showInstallmentsDropdown"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 14l5-5 5 5z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </span>
            <div v-if="showInstallmentsDropdown" class="dropdown-content">
              <label
                v-for="installment in availableInstallments"
                :key="installment"
                @click="selectInstallment(installment)"
              >
                <span>{{
                  installment === 0
                    ? "Sem parcelamento"
                    : installment + " parcelas"
                }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Instituições</label>
          <div class="dropdown">
            <input
              type="text"
              readonly
              :value="selectedInstitutionsNames.join(', ')"
              @click="toggleInstitutionsDropdown"
            />
            <span class="dropdown-icon" @click="toggleInstitutionsDropdown">
              <svg
                v-if="showInstitutionsDropdown"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 14l5-5 5 5z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </span>
            <div v-if="showInstitutionsDropdown" class="dropdown-content">
              <label v-for="institution in institutions" :key="institution.id">
                <span>{{ institution.name }}</span>
                <input
                  class="dropdown-content-checkbox"
                  type="checkbox"
                  :value="institution.id"
                  v-model="selectedInstitutions"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Convênios</label>
          <div class="dropdown">
            <input
              type="text"
              readonly
              :value="selectedAgreementsNames.join(', ')"
              @click="toggleAgreementsDropdown"
            />
            <span class="dropdown-icon" @click="toggleAgreementsDropdown">
              <svg
                v-if="showAgreementsDropdown"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 14l5-5 5 5z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </span>
            <div v-if="showAgreementsDropdown" class="dropdown-content">
              <label v-for="agreement in agreements" :key="agreement.id">
                <span class="dropdown-content-span">{{ agreement.name }}</span>
                <input
                  class="dropdown-content-checkbox"
                  type="checkbox"
                  :value="agreement.id"
                  v-model="selectedAgreements"
                />
              </label>
            </div>
          </div>
        </div>

        <button type="submit">SIMULAR</button>
      </form>
    </div>

    <div class="offers-container">
      <h2>Ofertas de empréstimo</h2>

      <div v-if="offers.length === 0" class="no-offers">
        <p>Insira os dados ao lado para ver as ofertas de empréstimo!</p>
      </div>

      <div v-else class="offers-list">
        <div v-for="offer in offers" :key="offer.id" class="offer-card">
          <img :src="bankImage(offer.bank)" alt="Banco" class="bank-logo" />
          <div class="offer-details">
            <p>Valor solicitado</p>
            <p>
              <strong>
                R$
                {{
                  parseFloat(offer.simulatedAmount).toFixed(2).replace(".", ",")
                }}
              </strong>
            </p>
          </div>
          <div class="offer-details">
            <p>Parcelas</p>
            <strong>
              <p>
                {{ offer.installments }}x R$
                {{
                  parseFloat(offer.installmentAmount)
                    .toFixed(2)
                    .replace(".", ",")
                }}
              </p>
            </strong>
          </div>
          <div class="offer-details">
            <p>Convênio</p>
            <strong>
              <p>
                {{ offer.bank }} ({{ offer.agreement }}) - {{ offer.rate }}%
              </p>
            </strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useLoanStore } from "@/store/loanStore";

export default {
  methods: {
    bankImage(bankName) {
      return `/images/${bankName.toLowerCase()}.png`;
    },
  },
  setup() {
    const loanStore = useLoanStore();
    const loanValue = ref("");
    const errorMessage = ref("");
    const selectedInstitutions = ref([]);
    const selectedAgreements = ref([]);
    const installmentValue = ref("");
    const availableInstallments = [0, 36, 48, 60, 72, 84];

    const institutions = computed(() => loanStore.institutions);
    const agreements = computed(() => loanStore.agreements);
    const offers = computed(() => loanStore.offers);

    const showInstallmentsDropdown = ref(false);
    const showInstitutionsDropdown = ref(false);
    const showAgreementsDropdown = ref(false);

    const toggleInstallmentsDropdown = () => {
      showInstallmentsDropdown.value = !showInstallmentsDropdown.value;
    };

    const toggleInstitutionsDropdown = () => {
      showInstitutionsDropdown.value = !showInstitutionsDropdown.value;
    };

    const toggleAgreementsDropdown = () => {
      showAgreementsDropdown.value = !showAgreementsDropdown.value;
    };

    const selectInstallment = (installment) => {
      installmentValue.value = installment;
      showInstallmentsDropdown.value = false;
    };

    const selectedInstitutionsNames = computed(() => {
      return institutions.value
        .filter((institution) =>
          selectedInstitutions.value.includes(institution.id)
        )
        .map((institution) => institution.name);
    });

    const selectedAgreementsNames = computed(() => {
      return agreements.value
        .filter((agreement) => selectedAgreements.value.includes(agreement.id))
        .map((agreement) => agreement.name);
    });

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
      validateLoanValue();
    };

    const validateLoanValue = () => {
      const numericValue = parseFloat(
        loanValue.value.replace("R$", "").replace(",", ".")
      );

      if (!loanValue.value.trim()) {
        errorMessage.value =
          "Por favor, insira um valor para simular o empréstimo.";
      } else if (isNaN(numericValue) || numericValue <= 0) {
        errorMessage.value = "O valor do empréstimo deve ser maior que zero.";
      } else {
        errorMessage.value = "";
      }
    };

    const submitForm = () => {
      validateLoanValue();

      if (errorMessage.value) return;

      const institutionsSelected = institutions.value
        .filter((institution) =>
          selectedInstitutions.value.includes(institution.id)
        )
        .map((institution) => institution.name);

      const agreementsSelected = agreements.value
        .filter((agreement) => selectedAgreements.value.includes(agreement.id))
        .map((agreement) => agreement.name);

      loanStore.fetchLoanOffers(
        parseFloat(loanValue.value.replace("R$", "").replace(",", ".")),
        institutionsSelected,
        agreementsSelected,
        installmentValue.value
      );
    };

    return {
      loanStore,
      loanValue,
      errorMessage,
      selectedInstitutions,
      selectedAgreements,
      installmentValue,
      availableInstallments,
      institutions,
      agreements,
      offers,
      showInstallmentsDropdown,
      showInstitutionsDropdown,
      showAgreementsDropdown,
      toggleInstallmentsDropdown,
      toggleInstitutionsDropdown,
      toggleAgreementsDropdown,
      formatCurrency,
      submitForm,
      selectInstallment,
      selectedInstitutionsNames,
      selectedAgreementsNames,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 20px;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-container {
  flex: 1;
  background-color: antiquewhite;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group input {
  color: orange;
}

.bank-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.offer-card {
  background-color: white;
  color: orange;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 250px;
  max-width: 100%;
}

.offer-details {
  flex: 1;
  min-width: 120px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offer-details p {
  margin: 0;
  font-size: 14px;
}

.offers-container {
  flex: 1;
  height: 450px;
  background-color: antiquewhite;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-offers {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: orange;
}

button {
  width: 100%;
  padding: 12px;
  background-color: orange;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: orange;
}

h2.title {
  color: black;
  text-align: center;
}

label {
  color: orange;
  font-weight: bold;
  margin-bottom: 5px;
  cursor: pointer;
}

.error-message {
  color: orange;
  font-size: 14px;
  margin-top: 5px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid antiquewhite;
  border-radius: 5px;
  background: white;
  box-sizing: border-box;
}

.dropdown {
  position: relative;
  width: 100%;
}

.dropdown input {
  cursor: pointer;
}

.dropdown-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid antiquewhite;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-content label {
  display: flex;
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-content label:hover {
  background-color: antiquewhite;
}

.dropdown-content label span {
  flex-grow: 1;
  text-align: left;
  color: orange;
}

.dropdown-content-checkbox {
  width: auto;
}
</style>
