import swal from 'sweetalert';
import { SwalOptions } from '_sweetalert@2.1.2@sweetalert/typings/modules/options';

export const Swal = {
  info(text: string, options?: Partial<SwalOptions>) {
    return swal({
      ...options,
      icon: 'info',
      text,
    })
  },
  success(text: string, options?: Partial<SwalOptions>) {
    return swal({
      ...options,
      icon: 'success',
      text,
    })
  },
  warning(text: string, options?: Partial<SwalOptions>) {
    return swal({
      ...options,
      icon: 'warning',
      text,
    })
  },
  error(text: string, options?: Partial<SwalOptions>) {
    return swal({
      ...options,
      icon: 'error',
      text,
    })
  },
  confirm(text: string, options?: Partial<SwalOptions>) {
    return swal({
      ...options,
      icon: 'warning',
      text,
      buttons: ['否', '是']
    })
  },
}