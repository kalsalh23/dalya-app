import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Spinner } from './Loader.jsx'

const VARIANTS = {
  primary: 'btn-primary',
  gradient: 'btn-gradient',
  soft: 'btn-soft',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  gold: 'btn-gradient',
  dark: 'btn-primary',
  secondary: 'btn-soft',
  danger: 'btn bg-rose text-white hover:bg-rose/90',
  light: 'btn bg-white text-ink shadow-lg hover:bg-chip',
}

const SIZES = {
  sm: 'btn-sm',
  md: '',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  const classes = cn(
    VARIANTS[variant],
    SIZES[size],
    (disabled || loading) && 'opacity-50 pointer-events-none',
    className
  )
  const inner = (
    <>
      {loading && <Spinner size={16} light={variant === 'primary' || variant === 'gradient' || variant === 'gold' || variant === 'dark' || variant === 'danger'} />}
      {children}
    </>
  )
  if (to) {
    const Comp = as || Link
    return (
      <Comp to={to} className={classes} {...props}>
        {inner}
      </Comp>
    )
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...props}>
        {inner}
      </a>
    )
  }
  return (
    <button type={props.type || 'button'} disabled={disabled || loading} className={classes} {...props}>
      {inner}
    </button>
  )
}
