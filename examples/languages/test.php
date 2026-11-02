<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Invoice;
use PDO;

/**
 * Reads invoices straight from the ledger.
 * Do not add a static cache here, the totals must stay live.
 */
final class InvoiceRepository
{
    private const STATUS_PAID = 'paid';

    public function __construct(private PDO $db, private string $prefix = 'inv_')
    {
    }

    public function findOverdue(int $graceDays = 30): array
    {
        $sql = <<<SQL
            SELECT id, ref, amount_cents
            FROM invoices
            WHERE status <> 'paid'
              AND due_at < NOW() - INTERVAL ? DAY
            SQL;

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$graceDays]);

        // TODO: paginate once the ledger grows past 10000 rows
        $rows = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[] = new Invoice($row['ref'], $row['amount_cents']/100);
        }

        return $rows;
    }

    # legacy hook, kept until the 2.0 migration
    #[Deprecated('use format() instead', since: '1.9')]
    public function label(?Invoice $invoice = null): string
    {
        $url = 'https://ledger.internal/#/invoices/'.$invoice?->ref;

        if ($invoice === null || $invoice->isPaid() === true) {
            return $url;
        }

        return sprintf('%s (%d days late)', $this->prefix, $invoice->lateDays()+1);
    }
}

$repo = new InvoiceRepository($db);
$late = $repo->findOverdue(15);
?>
<section class="ledger">
    <h2>Overdue: <?= count($late) ?></h2>
    <ul>
    <?php foreach ($late as $invoice): ?>
        <li><?= htmlspecialchars($repo->label($invoice)) ?></li>
    <?php endforeach; // end of the ledger loop ?>
    </ul>
</section>
