import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, List, Plus, Users, DollarSign } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    A: {
      text: "Aguardando pagamento",
      className: "bg-yellow-100 text-yellow-800",
    },
    P: {
      text: "Pago",
      className: "bg-green-100 text-green-800",
    },
    C: {
      text: "Cancelado",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[status] || {
    text: "Desconhecido",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}
    >
      {config.text}
    </span>
  );
};

const ActionButton = ({ onClick, color, children }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-xs font-medium rounded hover:opacity-80 transition-opacity ${color}`}
  >
    {children}
  </button>
);

const App = () => {
  const baseUrl = "https://localhost:44374/api";
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalIncluirPedido, setModalIncluirPedido] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPorPage = 5;
  const [modalListarPagamentos, setModalListarPagamentos] = useState(false);
  const [pagamentosCliente, setPagamentosCliente] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [loadingPagamentos, setLoadingPagamentos] = useState(false);
  const indexOfLastItem = currentPage * itemsPorPage;
  const indexOfFirstItem = indexOfLastItem - itemsPorPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [informacoesCliente, setInformacoesCliente] = useState({
    id: "",
    nome: "",
    email: "",
  });

  const [informacoesPedido, setInformacoesPedido] = useState({
    idCliente: "",
    valor: "",
    data: "",
  });

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPorPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
    if (!modalIncluir) {
      setInformacoesCliente({ id: "", nome: "", email: "" });
    }
  };

  const abrirFecharModalIncluirPedido = () => {
    setModalIncluirPedido(!modalIncluirPedido);
    if (!modalIncluirPedido) {
      setInformacoesPedido({ idCliente: "", valor: "", data: "" });
    }
  };

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setInformacoesCliente({ ...informacoesCliente, [name]: value });
  };

  const handlerChangePedido = (e) => {
    const { name, value } = e.target;
    setInformacoesPedido({ ...informacoesPedido, [name]: value });
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateCliente = () => {
    if (!informacoesCliente.nome.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return false;
    }
    if (!informacoesCliente.email.trim()) {
      toast.error("Email do cliente é obrigatório");
      return false;
    }
    if (!validateEmail(informacoesCliente.email)) {
      toast.error("Email inválido");
      return false;
    }
    return true;
  };

  const validatePagamento = () => {
    if (!informacoesPedido.valor || informacoesPedido.valor <= 0) {
      toast.error("Valor do pagamento deve ser maior que zero");
      return false;
    }
    if (!informacoesPedido.data) {
      toast.error("Data do pagamento é obrigatória");
      return false;
    }
    return true;
  };

  const getCliente = async () => {
    const loadingToast = toast.loading("Carregando clientes...");
    try {
      const response = await axios.get(baseUrl + "/Clientes");
      setData(response.data.dados);
      toast.success("Clientes carregados com sucesso", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar clientes", { id: loadingToast });
    }
  };

  const postCliente = async () => {
    if (!validateCliente()) return;

    const loadingToast = toast.loading("Cadastrando cliente...");
    try {
      const response = await axios.post(
        baseUrl + "/Clientes",
        informacoesCliente
      );
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
      toast.success("Cliente cadastrado com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao incluir cliente:", error);
      toast.error("Erro ao cadastrar cliente", { id: loadingToast });
    }
  };

  const pagamentoPost = async () => {
    if (!validatePagamento()) return;

    const loadingToast = toast.loading("Registrando pagamento...");
    try {
      const pagamentoData = {
        clienteId: informacoesCliente.id,
        valor: informacoesPedido.valor,
        dataPagamento: informacoesPedido.data,
      };
      const response = await axios.post(baseUrl + "/Pagamentos", pagamentoData);
      setData(data.concat(response.data));
      abrirFecharModalIncluirPedido();
      toast.success("Pagamento registrado com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao incluir pagamento:", error);
      toast.error("Erro ao registrar pagamento", { id: loadingToast });
    }
  };

  const abrirFecharModalListarPagamentos = () => {
    setModalListarPagamentos((state) => !state);
  };

  const mascaraDinheiro = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const buscarPagamentosCliente = async (cliente) => {
    setLoadingPagamentos(true);
    setPagamentosCliente([]);
    const loadingToast = toast.loading('Carregando pagamentos...');
    try {
      const response = await axios.get(`${baseUrl}/Pagamentos/clienteId=${cliente.id}`);
      if (response.data.status) {
        if (response.data.dados === null) {
          setPagamentosCliente([]);
        } else {
          setPagamentosCliente(response.data.dados);
        }
        setClienteSelecionado(cliente);
        toast.success(response.data.mensagem, { id: loadingToast });
      } else {
        toast.error(response.data.mensagem, { id: loadingToast });
        setPagamentosCliente([]);
      }
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      toast.error('Erro ao carregar pagamentos', { id: loadingToast });
      setPagamentosCliente([]);
    } finally {
      setLoadingPagamentos(false);
    }
  };

  const selecionarCliente = async (cliente, opcao) => {
    setInformacoesCliente(cliente);
    if (opcao === "incluirPedido") {
      abrirFecharModalIncluirPedido();
      toast.success(`Cliente ${cliente.nome} selecionado para pagamento`);
    } else if (opcao === "listarPagamentos") {
      await buscarPagamentosCliente(cliente);
      abrirFecharModalListarPagamentos();
    }
  };

  const calcularTotalPagamentos = () => {
    return pagamentosCliente.reduce(
      (total, pagamento) => total + parseFloat(pagamento.valor),
      0
    );
  };

  const atualizarStatusPagamento = async (pagamentoId, novoStatus) => {
    const loadingToast = toast.loading("Atualizando status...");
    try {
      const response = await axios.put(
        `${baseUrl}/Pagamentos/${pagamentoId}/status`,
        {
          id: pagamentoId,
          status: novoStatus,
        }
      );

      if (response.data.status) {
        setPagamentosCliente(
          pagamentosCliente.map((pagamento) =>
            pagamento.id === pagamentoId
              ? { ...pagamento, status: novoStatus }
              : pagamento
          )
        );

        const mensagem =
          novoStatus === "P"
            ? "Pagamento confirmado com sucesso!"
            : "Pagamento cancelado com sucesso!";
        toast.success(mensagem, { id: loadingToast });
      } else {
        toast.error(response.data.mensagem, { id: loadingToast });
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do pagamento", {
        id: loadingToast,
      });
    }
  };

  const renderPagamentoActions = (pagamento) => {
    if (pagamento.status === "A") {
      return (
        <div className="flex space-x-2">
          <ActionButton
            onClick={() => atualizarStatusPagamento(pagamento.id, "P")}
            color="bg-green-500 text-white"
          >
            Confirmar
          </ActionButton>
          <ActionButton
            onClick={() => atualizarStatusPagamento(pagamento.id, "C")}
            color="bg-red-500 text-white"
          >
            Cancelar
          </ActionButton>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    getCliente();
  }, []);

  useEffect(() => {
    console.log(pagamentosCliente);
  }, [pagamentosCliente]);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Cadastro de Clientes
              </h1>
            </div>
            <button
              onClick={abrirFecharModalIncluir}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(currentItems) && currentItems.length > 0 ? (
                  currentItems.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              selecionarCliente(cliente, "incluirPedido")
                            }
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span>Pagamento</span>
                          </button>
                          <button
                            onClick={() =>
                              selecionarCliente(cliente, "listarPagamentos")
                            }
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <List className="h-4 w-4" />
                            <span>Listar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <nav className="flex space-x-1">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {modalIncluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Incluir Cliente
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  onChange={handlerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handlerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o email do cliente"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
              <button
                onClick={abrirFecharModalIncluir}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={postCliente}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Incluir
              </button>
            </div>
          </div>
        </div>
      )}

      {modalIncluirPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Incluir Pagamento
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cliente ID
                </label>
                <input
                  type="text"
                  name="idCliente"
                  value={informacoesCliente?.id || ""}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <input
                  type="number"
                  name="valor"
                  value={informacoesPedido.valor}
                  onChange={handlerChangePedido}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o valor"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={informacoesPedido.data}
                  onChange={handlerChangePedido}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
              <button
                onClick={abrirFecharModalIncluirPedido}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={pagamentoPost}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Incluir
              </button>
            </div>
          </div>
        </div>
      )}
      {modalListarPagamentos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Histórico de Pagamentos
                  </h3>
                  {clienteSelecionado && (
                    <p className="text-sm text-gray-600">
                      Cliente: {clienteSelecionado.nome}
                    </p>
                  )}
                </div>
                <button
                  onClick={abrirFecharModalListarPagamentos}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto flex-1">
              {loadingPagamentos ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : pagamentosCliente.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pagamentosCliente.map((pagamento) => (
                          <tr key={pagamento.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              #{pagamento.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatarData(pagamento.dataPagamento)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {mascaraDinheiro(pagamento.valor)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={pagamento.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderPagamentoActions(pagamento)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {mascaraDinheiro(calcularTotalPagamentos())}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Nenhum pagamento encontrado para este cliente.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={abrirFecharModalListarPagamentos}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: "green",
              color: "white",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "red",
              color: "white",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "blue",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
