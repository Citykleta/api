export interface ShipholdExtension {
    priority: number;
    extension: (sh: any) => any;
}
