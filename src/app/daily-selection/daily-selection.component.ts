import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as range from 'lodash.range';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'app-daily-selection',
  templateUrl: './daily-selection.component.html',
  styleUrls: ['./daily-selection.component.scss']
})
export class DailySelectionComponent implements OnInit {

  public currentDate: moment.Moment;
  public namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public weeks: Array<CalendarDate[]> = [];

  public selectedDate;
  public show: boolean;

  @ViewChild('calendar', { static: true }) calendar;

  // Ocultar o calendário quando o usuário clicar fora do componente.
  // HostListener estará ouvindo cliques no documento e verificará se o destino do calendário contém o clique.
  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  constructor(private eRef: ElementRef) {
  }

  ngOnInit() {
    // Data selecionada será igual à data atual.
    this.currentDate = moment();
    this.selectedDate = moment(this.currentDate).format('DD/MM/YYYY');
    this.generateCalendar();
  }

  // É responsável por preencher a grade do calendário com semanas
  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  // Lista de todas as datas (não apenas o mês atual, porque o mês pode começar em algum lugar na primeira linha da grade)
  // Portanto, as datas contêm os dias do mês anterior, atual e seguinte
  // Dividimos as datas em matrizes de 7 dias e passamos para semanas
  private fillDates(currentMoment: moment.Moment) {
    //  Índice do primeiro dia e do último dia de um mês.
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    // O dia em que a grade de calendário começará e o dia em que terminará.
    // FirstDayOfGrid obtém o primeiro dia de um mês e subtrai seu índice.
    // Por exemplo, se o primeiro dia de um mês inicia na terça-feira, o índice será igual a 2.
    // E quando subtrairmos do primeiro dia esse índice obteremos o domingo (nossa semana começa no domingo).
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    // LastDayOfGrid obtém o último domingo da grade e adiciona 7 dias para encontrar o último dia da grade, que significa sábado.
    const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth, 'days').add(7, 'days');
    // StartCalendar é apenas um valor numérico do primeiro dia da grade.
    const startCalendar = firstDayOfGrid.date();

    // Cria uma faixa dinâmica do índice do primeiro dia até um número que contém uma quantidade de todos os dias na grade + índice do primeiro dia.
    // Por exemplo, se firstDayOfGrid for 29 de setembro e lastDayOfGrid for 2 de novembro, obteremos o intervalo (29, 29 + 35)
    return range(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
      };
    });
  }

  private isToday(date: moment.Moment): boolean {
    // Para descobrir se um dia da matriz de datas é hoje, usamos moment().IsSame() com a opção 'day'.
    return moment().isSame(moment(date), 'day');
  }

  // Para mostrar ao usuário sua escolha na lista de datas na IU, comparamos selectedDate com o dia do intervalo.
  // Não se esqueça de que a selectedDate está no formato dia/mês/ano, portanto, temos que transformar o dia para o mesmo formato.
  private isSelected(date: moment.Moment): boolean {
    return this.selectedDate === moment(date).format('DD/MM/YYYY');
  }

  // Mudar nosso mês atual para o próximo ou anterior e reconstruir o calendário.
  // Ou desative o botão seguinte se não quisermos trabalhar com datas futuras.
  // Além disso, se você quiser mostrar apenas as datas disponíveis no mês atual, podemos desabilitar os dias com isDayOfSelectedMonth.
  public prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  public nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  public isDisabledMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isAfter(today, 'months');
  }

  public isSelectedMonth(date: moment.Moment): boolean {
    const today = moment();
    return moment(date).isSame(this.currentDate, 'month') && moment(date).isSameOrAfter(today);
  }

  // Depois que o usuário escolheu uma data, devemos definir essa data como selectedDate e ocultar o calendário.
  public selectDate(date: CalendarDate) {
    this.selectedDate = moment(date.mDate).format('DD/MM/YYYY');

    this.generateCalendar();
    this.show = !this.show;
  }
}
