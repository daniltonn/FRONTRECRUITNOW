import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("✓ INTERCEPTOR EJECUTADO");

  const token = localStorage.getItem('ACCESS_TOKEN');

  if (token) {
    const reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("✓ TOKEN ENVIADO:", token);

    return next(reqWithToken);
  }

  console.warn("⚠ SIN TOKEN");

  return next(req);
};
