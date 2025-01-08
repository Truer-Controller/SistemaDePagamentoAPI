using System;
using System.ComponentModel.DataAnnotations;

namespace ControleDePedidosAPI.Models
{
    public class PagamentoModel
    {
        public int Id { get; set; }
        public ClienteModel Cliente { get; set; } // Chave estrangeira para o Cliente
        [Required(ErrorMessage = "O valor é obrigatorio para cadastrar um pedido.")]
        public float Valor { get; set; }
        [Required(ErrorMessage = "A data é obrigatoria para cadastrar um pedido.")]
        public DateTime DataPagamento { get; set; }
        public char Status {  get; set; } 
    }
}
