using ControleDePedidosAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ControleDePedidosAPI.Services.Pagamento;
using ControleDePedidosAPI.Dto.Pagamento;
using System.Linq;

namespace ControleDePedidosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly IPagamentoService _pagamentoInterface;
        public PagamentosController(IPagamentoService pagamentoInterface)
        {
            _pagamentoInterface = pagamentoInterface;
        }

        [HttpGet("clienteId={idCliente}")]
        public async Task<ActionResult<ResponseModel<PagamentoModel>>> GetPagamentosPorClienteAsync(int idCliente)
        {
            var pagamento = await _pagamentoInterface.GetPagamentosPorClienteAsync(idCliente);
            return Ok(pagamento);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseModel<PagamentoModel>>> CreatePagamentoAsync(CreatePagamentoDto createPagamentoDto)
        {
            var resposta = await _pagamentoInterface.CreatePagamentoAsync(createPagamentoDto);

            if (!resposta.Status)
                return BadRequest(resposta);

            return Ok(resposta);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<ResponseModel<List<PagamentoModel>>>> UpdateStatusPagamentoAsync(int id, [FromBody] UpdatePagamentoDto updatePagamentoDto)
        {
            if (id != updatePagamentoDto.Id)
            {
                return BadRequest("O ID na rota deve coincidir com o ID no corpo da requisição.");
            }

            var pagamento = await _pagamentoInterface.UpdateStatusPagamentoAsync(updatePagamentoDto);
            return Ok(pagamento);
        }
    }
}
