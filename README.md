## ツリーリンク（Tree Link）

treeの実行結果をHTMLに変換することができます。

## インストール

```bash
$ npm install --global @kokiito0926/treelink
```

## 実行方法

```bash
$ tree ./example/ > ./tree.txt
$ npx treee ./example/ > ./treee.txt
```

```bash
$ treelink --input ./tree.txt --output ./output.html
$ treelink --input ./treee.txt --output ./output.html
```

```bash
$ treelink --input ./tree.txt --output ./output.html --base "."
$ treelink --input ./treee.txt --output ./output.html --base "."
```

## ライセンス

[MIT](LICENSE)
