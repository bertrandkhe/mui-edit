import React from 'react';

const Text = <C extends React.ComponentType>(props: React.ComponentProps<C> & {
  as?: C,
  children: string,
}): JSX.Element => {
  const { as = 'span', children, ...otherProps } = props;
  const Component = as;
  return (
    <Component {...otherProps}>
      {children}
    </Component>
  );
}

export default Text;
