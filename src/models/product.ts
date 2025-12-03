export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
    price: number | null;
}