export type TLocale = {
    settings: {
        title: string;
        network: string;
        preference: string;
        about: string;
    };
    preference: {
        title: string;
        language: string;
        currency: string;
        notifications: string;
        display_language: string;
    };
    network: {
        title: string;
        line_management: string;
        rpc_management: string;
        add_evm: string;
        add_custom_node: string;
        auto_select: string;
        current_line: string;
        smart_line: string;
    };
    common: {
        confirm: string;
        cancel: string;
        back: string;
        save: string;
        default: string;
        custom: string;
    };
    home: {
        transfer: string;
        receive: string;
        scan: string;
        history: string;
        coins: string;
    };
    mine: {
        connected_apps: string;
        address_book: string;
        help_feedback: string;
        security_privacy: string;
        logout: string;
        invite_friends: string;
        welcome: string;
        login_register: string;
        network_fee_balance: string;
        one_account: string;
        invite_code: string;
        auto_gas_enabled: string;
    };
}
