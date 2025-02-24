import axios from "axios";
import loanAdapter from "@/core/adapters/loanAdapter";
import { Institution, Agreement } from "@/domain/models/loanModel";

const BASE_API_URL = "http://192.168.0.33:8000/api";

const api = axios.create({
  baseURL: BASE_API_URL,
});

const loanRepository = {
  async getInstitutions() {
    try {
      const response = await api.get("/instituicao");
      return response.data.map(
        (institution, index) =>
          new Institution(index + 1, institution.chave, institution.valor)
      );
    } catch (error) {
      console.error("Erro ao buscar instituições:", error);
      return [];
    }
  },

  async getAgreements() {
    try {
      const response = await api.get("/convenio");
      return response.data.map(
        (agreement, index) =>
          new Agreement(index + 1, agreement.chave, agreement.valor)
      );
    } catch (error) {
      console.error("Erro ao buscar convênios:", error);
      return [];
    }
  },

  async simulationRequest(value, institutions, agreements, installments) {
    try {
      const payload = {
        valor_emprestimo: parseFloat(value),
        instituicoes: institutions,
        convenios: agreements,
        parcelas: parseInt(installments) || 0,
      };

      const response = await api.post("/simular", payload);
      return loanAdapter.getOffersFromJson(response.data, value);
    } catch (error) {
      console.error("Erro na simulação de empréstimo:", error);
      return [];
    }
  },
};

export default loanRepository;
