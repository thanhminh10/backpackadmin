export interface IMenu {
  href?: string;
  icon?: JSX.Element;
  label?: string;
  submenu?: ISubMenu[]
}


export interface ISubMenu {
  href?: string;
  icon?: JSX.Element;
  label?: string;
}
