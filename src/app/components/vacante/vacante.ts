import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';


import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { VacanteService } from '../../services/vacante-service';


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
  editableVacante = false;

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
    this.vacanteService.getAll().subscribe((data: any) => {
      this.vacanteList = data;
    });
  }

  newMessage(msg: string) {
    this.toastr.success('Click para actualizar la lista', msg)
      .onTap.pipe(take(1)).subscribe(() => window.location.reload());
  }

  newVacanteEntry() {
    const body = this.vacanteForm.value;

    this.vacanteService.create(body).subscribe({
      next: () => {
        this.router.navigate(['/vacantes'])
          .then(() => this.newMessage('Vacante registrada'));
      },
      error: (err) => console.error('ERROR POST:', err)
    });
  }

  toggleEditVacante(id: any) {
    this.idVacante = id;

    this.vacanteService.get(id).subscribe((data: any) => {
      this.vacanteForm.setValue({
        titulo: data.titulo ?? '',
        descripcion: data.descripcion ?? '',
        ubicacion: data.ubicacion ?? '',
        salario: data.salario ?? '',
        experienciaRequerida: data.experienciaRequerida ?? '',
        requisitosEstudio: data.requisitosEstudio ?? '',
        NBC: data.NBC ?? ''
      });
    });

    this.editableVacante = true;
  }

  updateVacanteEntry() {
    const body = this.vacanteForm.value;

    this.vacanteService.update(this.idVacante, body).subscribe({
      next: () => this.newMessage('Vacante editada'),
      error: (err) => console.error('ERROR PUT:', err)
    });
  }

  deleteVacanteEntry(id: any) {
    this.vacanteService.delete(id).subscribe({
      next: () => this.newMessage('Vacante eliminada'),
      error: (err) => console.error('ERROR DELETE:', err)
    });
  }
}
