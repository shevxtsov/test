export default function () {
  return [
    {
      id: 6,
      link: '#',
      name: this.$t('Equipment'),
      toolbar: true,
      min: 'min-1900',
      subList: [
        {
          link: '/checking-state',
          name: this.$t('CheckingState')
        }
      ]
    },
    {
      id: 9,
      link: '/audits',
      name: this.$t('Audits'),
      toolbar: true,
      min: 'min-1900'
    }
  ]
}
