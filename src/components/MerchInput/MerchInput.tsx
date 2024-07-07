import { Box, Checkbox, Collapse, Editable, EditableInput, EditablePreview, Input, Stack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import { Item, Merch } from '../../utils/types';

import './MerchInput.scss';

interface MerchInputProps {
  type: 'in' | 'out';
  merch: Array<Merch>;
  items?: Array<Item>;
  updateMerch: Function;
  addMerch: Function;
  deleteMerch: Function;
}

const MerchInput = ({ type, merch, items, updateMerch, addMerch, deleteMerch }: MerchInputProps) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Array<string>>([]);
  const onSelectHandle = (newVal: boolean, itemId: string) => {
    if (newVal) {
      if (!selected.includes(itemId)) setSelected([...selected, itemId]);
    } else {
      setSelected(selected.filter((selectedId) => selectedId !== itemId));
    }
  };

  const onDeleteHandler = () => {
    // Add confirmation modal later
    deleteMerch(selected);
    setSelected([]);
  };

  const expectedSales = (merchItem: Merch): number => {
    return merchItem.amount * (items?.filter((item) => item.name === merchItem.itemName)[0]?.goalPrice || 0);
  };

  return (
    <Box className="merch-input-container">
      <Collapse in={!!selected.length} animateOpacity>
        <Box className="actions" mb="1rem">
          <p>{t('general.selectedItems', { amount: selected.length })}</p>
          <Stack>
            <Button colorScheme="red" variant="outline" w="120px" size="sm" onClick={onDeleteHandler}>
              🗑️ {t('general.delete')}
            </Button>
          </Stack>
        </Box>
      </Collapse>
      <Box className="header-space">
        <h2>{type === 'in' ? t('general.merchIn') : t('general.merchOut')}</h2>

        <Button colorScheme="blue" size="sm" variant="outline" mb="2" onClick={() => addMerch()}>
          {t('general.addMerch')}
        </Button>
      </Box>
      <TableContainer className="merch-table table">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>{t('fields.title.description')}</Th>
              <Th>{t('fields.title.itemName')}</Th>
              <Th>{t('fields.title.price')}</Th>
              <Th>{t('fields.title.amount')}</Th>
              <Th>{t('fields.title.date')}</Th>
              {type === 'in' && <Th>{t('general.totalSpent')}</Th>}
              {type === 'out' && <Th>{t('general.saleOverExpectedSales')}</Th>}
              <Th className="selection">{/* t('general.selection') */}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {merch.map((item: Merch, idx: number) => (
              <Tr key={item.id || idx} className={`${item.id ? 'has-id' : 'no-id'} highlightable`}>
                <Td>
                  <Editable defaultValue={item.description || undefined}>
                    <EditablePreview />
                    <EditableInput
                      value={item.description}
                      onChange={(e) => updateMerch(idx, e.target.value, 'description')}
                    />
                  </Editable>
                </Td>
                <Td className="name">
                  <Editable defaultValue={item.itemName || undefined}>
                    <EditablePreview />
                    <EditableInput
                      value={item.itemName}
                      onChange={(e) => updateMerch(idx, e.target.value, 'itemName')}
                    />
                  </Editable>
                </Td>
                <Td className="price">
                  <Editable>
                    <CurrencyInput
                      name="price"
                      placeholder=""
                      prefix="$"
                      defaultValue={item.price}
                      decimalsLimit={0}
                      onValueChange={(value, name, values) => updateMerch(idx, value, name)}
                    />
                    <Input as={EditableInput} />
                  </Editable>
                </Td>
                <Td className="amount">
                  <Editable defaultValue={item.amount || undefined}>
                    <EditablePreview />
                    <EditableInput
                      max="9999"
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateMerch(idx, e.target.value, 'amount')}
                    />
                  </Editable>
                </Td>
                <Td className="date">
                  <Editable defaultValue={item.date || undefined}>
                    <EditablePreview />
                    <EditableInput
                      type="date"
                      value={item.date}
                      onChange={(e) => updateMerch(idx, e.target.value, 'date')}
                    />
                  </Editable>
                </Td>
                {type === 'in' && (
                  <Td>
                    {formatValue({
                      value: (item.price * item.amount).toString(),
                      prefix: '$',
                    })}
                  </Td>
                )}
                {type === 'out' && (
                  <Td>
                    {formatValue({
                      value: (item.price * item.amount).toString(),
                      prefix: '$',
                    })}{' '}
                    /{' '}
                    {formatValue({
                      value: expectedSales(item).toString(),
                      prefix: '$',
                    })}
                  </Td>
                )}
                <Td className="selection">
                  <Checkbox
                    onChange={(e) => onSelectHandle(e.target.checked, item.id)}
                    colorScheme="red"
                    isChecked={selected.includes(item.id)}
                  ></Checkbox>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MerchInput;
