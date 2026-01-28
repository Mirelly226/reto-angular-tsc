import { ChangeDetectionStrategy, Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { IDropdownOption, MenuAction } from '../../types/menu.types';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';

@Component({
    selector: 'app-dropdown-menu',
    imports: [IconButtonComponent],
    templateUrl: './dropdown-menu.component.html',
    styleUrl: './dropdown-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
    private readonly elementRef = inject(ElementRef);

    options = input<IDropdownOption[]>([]);

    optionSelected = output<MenuAction>();

    readonly isOpen = signal<boolean>(false);

    toggle(): void {
        this.isOpen.update(value => !value);
    }

    selectOption(action: MenuAction): void {
        this.optionSelected.emit(action);
        this.isOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }
}
