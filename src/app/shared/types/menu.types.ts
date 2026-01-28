export type MenuAction = 'edit' | 'delete';

export interface IDropdownOption {
    label: string;
    action: MenuAction;
}