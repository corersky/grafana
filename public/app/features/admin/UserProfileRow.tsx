import React, { PureComponent, FC, useContext } from 'react';
import { css, cx } from 'emotion';
import { ThemeContext, ConfirmButton } from '@grafana/ui';

const labelStyle = css`
  font-weight: 500;
`;

interface UserProfileRowProps {
  label: string;
  value?: any;
  editable?: boolean;
  children?: JSX.Element;
}

export const UserProfileRow: FC<UserProfileRowProps> = ({ label, value, editable, children }) => {
  return (
    <tr>
      <td className={`width-16 ${labelStyle}`}>{label}</td>
      {value && (
        <td className="width-25" colSpan={2}>
          {value}
        </td>
      )}
      {children || <td />}
    </tr>
  );
};

interface EditableRowProps {
  label: string;
  value?: string;
  editButton?: boolean;
  onChange?: (value: string) => void;
}

interface EditableRowState {
  editing: boolean;
}

export class EditableRow extends PureComponent<EditableRowProps, EditableRowState> {
  inputElem: HTMLInputElement;

  state = {
    editing: false,
  };

  handleEdit = () => {
    this.setState({ editing: true }, this.focusInput);
  };

  handleEditClick = () => {
    if (this.state.editing) {
      return;
    }
    this.setState({ editing: true }, this.focusInput);
  };

  handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ editing: false });
    if (this.props.onChange) {
      const newValue = event.target.value;
      this.props.onChange(newValue);
    }
  };

  focusInput = () => {
    this.inputElem.focus();
  };

  handleSave = () => {
    console.log('save', this.props.value);
  };

  render() {
    const { label, value } = this.props;

    return (
      <tr>
        <td className={`width-16 ${labelStyle}`}>{label}</td>
        <td className="width-25" colSpan={2}>
          {this.state.editing ? (
            <input
              defaultValue={value}
              ref={elem => {
                this.inputElem = elem;
              }}
              onBlur={this.handleInputBlur}
            />
          ) : (
            <span onClick={this.handleEdit}>{value}</span>
          )}
        </td>
        <td>
          <div className="pull-right">
            <ConfirmButton
              onClick={this.handleEditClick}
              onConfirm={this.handleSave}
              buttonText="Edit"
              confirmText="Save"
            />
          </div>
        </td>
      </tr>
    );
  }
}

interface LockedLDAPRowProps {
  label: string;
  value?: any;
}

export const LockedLDAPRow: FC<LockedLDAPRowProps> = ({ label, value }) => {
  const lockMessageClass = cx(
    'pull-right',
    css`
      font-style: italic;
      margin-right: 0.6rem;
    `
  );

  return (
    <tr>
      <td className={`width-16 ${labelStyle}`}>{label}</td>
      <td className="width-25" colSpan={2}>
        {value}
      </td>
      <td>
        <span className={lockMessageClass}>Synced via LDAP</span>
      </td>
    </tr>
  );
};

export interface RowActionProps {
  text: string;
  onClick: (event: React.MouseEvent) => void;
  align?: 'left' | 'right';
}

export const RowAction: FC<RowActionProps> = (props: RowActionProps) => {
  const { onClick, text, align } = props;
  const theme = useContext(ThemeContext);
  const actionClass = cx(
    { 'pull-right': align !== 'left' },
    css`
      margin-right: 0.6rem;
      text-decoration: underline;
      color: ${theme.colors.blue95};
    `
  );

  return (
    <a type="button" onMouseDown={onClick} className={actionClass}>
      {text}
    </a>
  );
};
