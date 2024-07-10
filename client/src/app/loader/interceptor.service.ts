import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);
    this.loaderService.setProgress(0);  // Reset progress at the start

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          console.log('Event type:', event.type);  // Log all event types
          if (event.type === HttpEventType.DownloadProgress) {
            if (event.total) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`Download progress: ${percentDone}%`);
              this.loaderService.setProgress(percentDone);
            } else {
              console.log(`Downloaded ${event.loaded} bytes`);
              // You might want to use an indeterminate progress indicator here
            }
          } else if (event.type === HttpEventType.Response) {
            console.log('Request complete');
            this.loaderService.isLoading.next(false);
            this.loaderService.setProgress(100);
          }
        },
        error => {
          console.error('Error in interceptor:', error);
          this.loaderService.isLoading.next(false);
          this.loaderService.setProgress(0);
        }
      ),
      finalize(() => {
        this.loaderService.isLoading.next(false);
        this.loaderService.setProgress(100);
      })
    );
  }
}
