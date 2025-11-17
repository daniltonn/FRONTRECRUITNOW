import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { VacanteService } from '../../services/vacante-service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-vacante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vacante.html',
  styleUrls: ['./vacante.css']
})
export class VacanteComponent implements OnInit {

  vacanteList: any[] = [];
  vacanteForm!: FormGroup;

  idVacante: any;
  editableVacante: boolean = false;

  constructor(
    private vacanteService: VacanteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllVacantes();
  }

  buildForm() {
    this.vacanteForm = this.formBuilder.group({
      titulo: [''],
      descripcion: [''],
      ubicacion: [''],
      salario: [''],
      experienciaRequerida: [''],
      requisitosEstudio: [''],
      NBC: ['']
    });
  }

  getAllVacantes() {
    this.vacanteService.getAllVacantes().subscribe((data: any) => {
      this.vacanteList = data;
    });
  }

  newMessage(messageText: string) {
    this.toastr.success('Click para actualizar la lista', messageText)
      .onTap.pipe(take(1)).subscribe(() => window.location.reload());
  }

  newVacanteEntry() {
    const form = this.vacanteForm.value;

    const body = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
      salario: form.salario,
      experienciaRequerida: form.experienciaRequerida,
      requisitosEstudio: form.requisitosEstudio,
      NBC: form.NBC
    };

    this.vacanteService.newVacante(body).subscribe({
      next: () => {
        this.router.navigate(['/vacantes'])
          .then(() => this.newMessage('Vacante registrada'));
      },
      error: (err) => console.error('ERROR POST:', err)
    });
  }

  toggleEditVacante(id: any) {
    this.idVacante = id;

    this.vacanteService.getOneVacante(id).subscribe((data) => {
      this.vacanteForm.setValue({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        ubicacion: data.ubicacion || '',
        salario: data.salario || '',
        experienciaRequerida: data.experienciaRequerida || '',
        requisitosEstudio: data.requisitosEstudio || '',
        NBC: data.NBC || ''
      });
    });

    this.editableVacante = !this.editableVacante;
  }

  updateVacanteEntry() {
    const form = this.vacanteForm.value;

    const body = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
      salario: form.salario,
      experienciaRequerida: form.experienciaRequerida,
      requisitosEstudio: form.requisitosEstudio,
      NBC: form.NBC
    };

    this.vacanteService.updateVacante(this.idVacante, body).subscribe({
      next: () => this.newMessage('Vacante editada'),
      error: (err) => console.error('ERROR PUT:', err)
    });
  }

  deleteVacanteEntry(id: any) {
    this.vacanteService.deleteVacante(id).subscribe({
      next: () => this.newMessage('Vacante eliminada'),
      error: (err) => console.error('ERROR DELETE:', err)
    });
  }

}
