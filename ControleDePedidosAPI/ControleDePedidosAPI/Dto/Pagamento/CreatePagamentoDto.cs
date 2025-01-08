using System;
using System.ComponentModel.DataAnnotations;
using ControleDePedidosAPI.Dto.Vinculo;

namespace ControleDePedidosAPI.Dto.Pagamento
{
    public class CreatePagamentoDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor do pagamento deve ser maior que zero.")]
        public float Valor { get; set; }

        [Required(ErrorMessage = "A data do pagamento é obrigatória.")]
        public DateTime DataPagamento { get; set; }

        [Required(ErrorMessage = "O ID do cliente é obrigatório.")]
        public int ClienteId { get; set; }
    }
}
