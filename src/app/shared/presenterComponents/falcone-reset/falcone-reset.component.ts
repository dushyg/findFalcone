import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: ''
})
export class FalconeResetComponent {

    constructor(private router: Router) {}

    ngOnInit() {

        this.router.navigate(['/finderboard']);
    }
}
