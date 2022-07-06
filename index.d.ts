export default LogJS;
export namespace Styles {
    namespace _default {
        const label: string;
        const message: string;
    }
    export { _default as default };
    export namespace fatal {
        const label_1: string;
        export { label_1 as label };
        const message_1: string;
        export { message_1 as message };
    }
    export namespace alert {
        const label_2: string;
        export { label_2 as label };
        const message_2: string;
        export { message_2 as message };
    }
    export namespace info {
        const label_3: string;
        export { label_3 as label };
        const message_3: string;
        export { message_3 as message };
    }
}
export namespace Processors {
    function lower(value: any): any;
    function upper(value: any): any;
    function left(value: any, option: any): any;
    function right(value: any, option: any): any;
    function json(value: any): string;
    function date(value: any, option: any): any;
    function ux(value: any, option: any): string;
}
declare function LogJS(label?: string, params?: {}): {
    clear: () => any;
    whoami: () => any;
    p: (input: any, params?: {
        style: string;
        type: string;
    }) => any;
    type: (type?: string) => any;
    style: (style?: string) => any;
    set: (input: any) => any;
    out: (out?: string) => any;
    include: (params: any) => any;
    limit: (params: any) => any;
    process: (params: any) => any;
};
