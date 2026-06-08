import Swal from 'sweetalert2';

export async function confirmAction({
  title,
  text,
  icon = 'warning',
  confirmText = 'Ya',
  cancelText = 'Batal',
  confirmColor = '#198754',
  cancelColor = '#6c757d',
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
  return result.isConfirmed;
}

export function toastSuccess(title, text) {
  return Swal.fire({ icon: 'success', title, text, timer: 1500, showConfirmButton: false });
}

export function toastError(title, text) {
  return Swal.fire({ icon: 'error', title, text });
}
