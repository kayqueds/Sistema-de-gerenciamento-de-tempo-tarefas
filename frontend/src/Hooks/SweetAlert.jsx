import Swal from "sweetalert2";
// criando alerta de confirmação
function useSweetAlert() {
  const showConfirmation = async (message, messageButton) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: messageButton,
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  };

  return { showConfirmation };
}

export default useSweetAlert;