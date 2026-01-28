## ツリーリンク（treelink）

ツリーリンク（treelink）を用いると、treeの実行結果をHTMLに変換することができます。  
静的なウェブサイトをデプロイして、ファイル一覧を確認するようなときに便利かもしれません。

## インストール

```bash
$ npm install --global @kokiito0926/treelink
```

## 実行方法

```bash
$ tree . -L 2 | treelink
$ tree . -L 2 | treelink --base "."
$ tree . -L 2 | treelink --base "./src"
```

## ライセンス

[MIT](LICENSE)
