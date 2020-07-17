interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      address: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      address: 'maycon.rayone@gmail.com',
      name: 'Maycon Rayone',
    },
  },
} as IMailConfig;
